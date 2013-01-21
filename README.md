# Maxmertkit for Rails

Maxmertkit is css framework based on widget-modifier coding style

Official repo: https://github.com/maxmert/maxmertkit

Official demo: http://maxmert.com/

## Installation

Add this line to your application's Gemfile:

    gem 'maxmertkit-rails'

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install maxmertkit-rails

## Stylesheets

Add necessary stylesheet file to app/assets/stylesheets/application.css

``` css
*= require maxmertkit
*= require maxmertkit-components
*= require maxmertkit-animation
```

## Javascripts

Add necessary javascript(s) files to app/assets/javascripts/application.js

``` javascript

// Include all maxmertkit's javascripts
//= require maxmertkit.all

// Or peek any of them yourself
//= require maxmertkit
//= require maxmertkit.notify
//= require maxmertkit.button
//= require maxmertkit.affix
//= require maxmertkit.carousel
//= require maxmertkit.modal
//= require maxmertkit.popup
//= require maxmertkit.scrollspy
//= require maxmertkit.tabs

//= require libs/easing
//= require libs/html5shiv
//= require libs/imagesLoaded
//= require libs/modernizr
```

## Thanks

Thanks maxmert! This guy is owner
https://github.com/maxmert/maxmertkit

Official demo: http://maxmert.com/

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
