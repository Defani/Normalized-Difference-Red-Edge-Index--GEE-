var csPlus = ee.ImageCollection('GOOGLE/CLOUD_SCORE_PLUS/V1/S2_HARMONIZED');

function maskS2CSPlus(image) {
  var qa = image.select('cs_cdf');
  return image.updateMask(qa.gte(0.60));
}

var s2_base = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(geometry)
  .filterDate('2024-01-01', '2024-12-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20));

var composite_csplus = s2_base
  .linkCollection(csPlus, ['cs_cdf'])
  .map(maskS2CSPlus)
  .median()
  .clip(geometry)
  .divide(10000);

var ndre = composite_csplus.normalizedDifference(['B8', 'B5']).rename('NDRE');

var visNDRE = {
  min: 0,
  max: 0.6,
  palette: ['#d73027','#fdae61','#fee08b','#d9ef8b','#66bd63','#1a9850']
};

Map.addLayer(ndre, visNDRE, 'NDRE Cloud Score+');
Map.centerObject(geometry, 13);