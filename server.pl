#!/usr/bin/env perl
use strict;
use warnings;
use IO::Socket::INET;
use File::Spec;
use Cwd qw(abs_path);

my $port = $ARGV[0] || 8080;
my $docroot = abs_path(".");

my %mime = (
    html => 'text/html; charset=utf-8',
    htm  => 'text/html; charset=utf-8',
    css  => 'text/css; charset=utf-8',
    js   => 'application/javascript; charset=utf-8',
    png  => 'image/png',
    jpg  => 'image/jpeg',
    jpeg => 'image/jpeg',
    svg  => 'image/svg+xml',
    ico  => 'image/x-icon',
    json => 'application/json',
    txt  => 'text/plain; charset=utf-8',
);

my $server = IO::Socket::INET->new(
    LocalHost => '0.0.0.0',
    LocalPort => $port,
    Proto     => 'tcp',
    Listen    => 20,
    ReuseAddr => 1,
) or die "Cannot create socket on port $port: $!\n";

print "HTTP Server running at http://localhost:$port/\n";

while (my $client = $server->accept()) {
    my $req_line = <$client>;
    next unless $req_line;
    
    # Read headers
    while (my $line = <$client>) {
        last if $line =~ /^\r?\n$/;
    }
    
    if ($req_line =~ m{^(GET|HEAD)\s+([^\s\?]+)}) {
        my $method = $1;
        my $path = $2;
        $path =~ s/%([0-9A-Fa-f]{2})/chr(hex($1))/eg; # url decode
        $path = '/index.html' if $path eq '/' || $path eq '';
        
        my $filepath = File::Spec->canonpath("$docroot/$path");
        
        # Security check: must remain inside docroot
        if ($filepath !~ /^\Q$docroot\E/ || !-f $filepath) {
            print $client "HTTP/1.1 404 Not Found\r\nContent-Type: text/plain\r\nContent-Length: 13\r\nConnection: close\r\n\r\n404 Not Found";
            close $client;
            next;
        }
        
        my ($ext) = $filepath =~ /\.([a-zA-Z0-9]+)$/;
        $ext = lc($ext || '');
        my $content_type = $mime{$ext} || 'application/octet-stream';
        
        my $filesize = -s $filepath;
        
        print $client "HTTP/1.1 200 OK\r\n";
        print $client "Content-Type: $content_type\r\n";
        print $client "Content-Length: $filesize\r\n";
        print $client "Access-Control-Allow-Origin: *\r\n";
        print $client "Connection: close\r\n\r\n";
        
        if ($method eq 'GET') {
            if (open my $fh, '<:raw', $filepath) {
                my $buffer;
                while (read($fh, $buffer, 65536)) {
                    print $client $buffer;
                }
                close $fh;
            }
        }
    } else {
        print $client "HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n";
    }
    close $client;
}
