﻿// 인서트 PNG 저장 스크립트 by AJ (ver.20190717)

executeAction(app.stringIDToTypeID('save'), undefined, DialogModes.NO);

var ingDoc = app.activeDocument;
var ingDocName = ingDoc.name.split(".").shift();
var ingDocPath = ingDoc.path;
var allLayers = ingDoc.layers

var pngOptions = new PNGSaveOptions();
pngOptions.compression = 0; // CC2019 PNG 저장 방법 바뀐듯...체크 필요!



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

function pngSavePerLayer() {
    var selectedLayers = getSelectedLayers(ingDoc);
    selectedLayers.reverse();
    for (i = 0; i < selectedLayers.length; i++) {
        if (selectedLayers[i].parent.typename == "LayerSet") {
            alert("최상위 레이어, 그룹들을 선택하세요");
            return;
        }
    }

    for (i=0; i < allLayers.length; i++){
        allLayers[i].visible = false;
    }

    app.activeDocument.info.caption = "Saved by 인서트 PNG 저장 스크립트 v1.0";

    for(i = 0; i < selectedLayers.length; i++) {
        selectedLayers[i].visible = true;
        ingDoc.saveAs(new File(ingDocPath + "/" + ingDocName + "_" + (i + 1)), pngOptions, true, Extension.LOWERCASE);
        selectedLayers[i].visible = false;
    }

    executeAction(app.stringIDToTypeID('revert'), undefined, DialogModes.NO);

    alert("레이어 " + selectedLayers.length + "개 PNG로 저장")
}


pngSavePerLayer();