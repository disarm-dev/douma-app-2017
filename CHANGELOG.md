# CHANGELOG

## release_03

### Features
- **General**
-  Renamed `meta` to `user`
-  Added offline analytics with SW
- **IRS Plan**
-  Sending PBF instaed of geojson ()
- Ability to download shapefile of clusters in IRS Plan (As one MultiPolygon for now)
-  Change the attribute that orders the operational units (Elevation?)
- **IRS Record**
-  (IRS Record and Monitor now work for Zimbabwe)
-  Improved the status options on the structure progress page (TaskEdit)
- **Layers**
- Layers applet with weather and risk rasters.

### Bug fixes
- Remove 'TaskView' and 'Tasker' titles from IRS Tasker
- IRS Record was not able to search for more clusters after doing it once. Now has own set of clusters to search.
-  

### Breaking changes
- Get logged out when updating the application.

## release_02
- First end-to-end flow of data
- Changed dashboard to use white boxes [IRS Monitor]
- Few quirks included (occasional reloads required)
