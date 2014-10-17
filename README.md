adapt-contrib-wipe
==================

An Adapt core extension to transition and animate between articles.

JSON configuration
------------------

### Content Object

The following code outlines the settings that can be added to the content object JSON.

```
_wipe: {
	// extension turn on/off
	_isActive: boolean, 
	// show/hide controls
	_showControls: boolean, 
	// show/hide nav icons
	_showNavigation: boolean, 
	// use graphics for nav icons (css style icons by default)
	_showNavigationAsGraphic: boolean, 
	// show animation when 'wiping'
	_useWipeEffect: boolean
}
```

### Article

The following code outlines the settings that can be added to the article JSON.

```
_wipe: {
	graphic: {
		src: string,
		src-selected: string,
		alt: string,
		title: string
	}, 
	tool-tip: {
		title: string
	}, 
	// any extra classes needed
	_classes: string
}
```

Browser support
---------------
TBC
