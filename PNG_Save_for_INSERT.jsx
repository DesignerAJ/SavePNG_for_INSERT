// 인서트 png 분리 저장 스크립트 by AJ (ver.ing)


executeAction(app.stringIDToTypeID('save'), undefined, DialogModes.NO);

var ingDoc = app.activeDocument;
var ingDocName = ingDoc.name.split(".").shift();
var ingDocPath = ingDoc.path;
var background = ingDoc.layers[ingDoc.layers.length -1];

var pngOptions = new PNGSaveOptions();
pngOptions.compression = 0; // CC2019 PNG 저장 방법 바뀜...체크!



function cTID(s) { return app.charIDToTypeID(s); }
function sTID(s) { return app.stringIDToTypeID(s); }
function undo() { executeAction(cTID("undo", undefined, DialogModes.NO)); }


function newGroupFromLayers(doc) {
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(sTID('layerSection'));
    desc.putReference(cTID('null'), ref);
    var lref = new ActionReference();
    lref.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc.putReference(cTID('From'), lref);
    executeAction(cTID('Mk  '), desc, DialogModes.NO);
}


function getSelectedLayers(doc) {
    var selLayers = [];
    newGroupFromLayers();

    var group = doc.activeLayer;
    var layers = group.layers;

    for (var i = 0; i < layers.length; i++) {
        selLayers.push(layers[i]);
    }

    undo();
    return selLayers;
}


function selectAllLayers() {
    var ref = new ActionReference();
    ref.putEnumerated( cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    var desc = new ActionDescriptor();
    desc.putReference(cTID('null'), ref);
    executeAction(sTID('selectAllLayers'), desc, DialogModes.NO);
}


function hideLayers() {
    var ref = new ActionReference();
    ref.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    var list = new ActionList();
    list.putReference(ref);
    var desc = new ActionDescriptor();
    desc.putList(cTID('null'), list);
    executeAction(cTID('Hd  '), desc, DialogModes.NO);

    if (background.isBackgroundLayer) {
        background.visible = false;
    }
}



var selectedLayers = getSelectedLayers(ingDoc);
selectAllLayers();
hideLayers();

for(i = 0; i < selectedLayers.length; i++) {
    selectedLayers[i].visible = true;
    ingDoc.saveAs(new File(ingDocPath + "/" + ingDocName + "_" + (i + 1)), pngOptions, true, Extension.LOWERCASE);
    // selectedLayers[i].visible = false;
}

executeAction(app.stringIDToTypeID('revert'), undefined, DialogModes.NO);
