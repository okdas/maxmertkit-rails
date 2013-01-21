# -*- encoding: utf-8 -*-
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'maxmertkit-rails/version'

Gem::Specification.new do |gem|
  gem.name          = "maxmertkit-rails"
  gem.version       = Maxmertkit::Rails::VERSION
  gem.authors       = ["Viktor Tomilin"]
  gem.email         = ["caballerosolar@gmail.com"]
  gem.description   = "Css framework based on widget-modifier coding style"
  gem.summary       = "Css framework based on widget-modifier coding style"
  gem.homepage      = "http://maxmert.com/"

  gem.files         = `git ls-files`.split($/)
  gem.executables   = gem.files.grep(%r{^bin/}).map{ |f| File.basename(f) }
  gem.test_files    = gem.files.grep(%r{^(test|spec|features)/})
  gem.require_paths = ["lib"]
end
