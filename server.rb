require 'webrick'
require 'socket'

port = 3000

# Get local IP for LAN access
local_ip = Socket.ip_address_list.find { |ai| ai.ipv4? && !ai.ipv4_loopback? }
ip_str = local_ip ? local_ip.ip_address : '127.0.0.1'

server = WEBrick::HTTPServer.new(
  Port: port,
  DocumentRoot: File.expand_path(__dir__),
  BindAddress: '0.0.0.0',
  Logger: WEBrick::Log.new($stderr, WEBrick::Log::INFO),
  AccessLog: []
)

trap('INT') { server.shutdown }

puts "=" * 60
puts "🤖 TITAN-6X ROBOT TELEOPERATION DASHBOARD"
puts "=" * 60
puts " ▸ Local Access:    http://localhost:#{port}"
puts " ▸ Network Access:  http://#{ip_str}:#{port}"
puts "=" * 60

server.start
