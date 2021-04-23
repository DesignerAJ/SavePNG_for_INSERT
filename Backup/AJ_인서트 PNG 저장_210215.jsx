// 인서트 PNG 저장 스크립트 by AJ (ver.2021.02.15)
try {

    executeAction(app.stringIDToTypeID('save'), undefined, DialogModes.NO);

    var ingDoc = app.activeDocument;
    var ingDocName = ingDoc.name.substring(0, ingDoc.name.lastIndexOf("."));
    var ingDocNameHyphen = ingDocName.replace(/ /g,"-");
    var ingDocPath = ingDoc.path;
    var allLayers = ingDoc.layers;

    var options = new ExportOptionsSaveForWeb();
    options.format = SaveDocumentType.PNG;
    options.PNG8 = false;


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

        if (selectedLayers.length == 0) {
            alert("최상위 레이어 or 그룹을 선택하세요");
            return;
        }

        for (i = 0; i < selectedLayers.length; i++) {
            if (selectedLayers[i].parent.typename == "LayerSet") {
                alert("최상위 레이어 or 그룹을 선택하세요");
                return;
            }
        }

        for (i=0; i < allLayers.length; i++){
            allLayers[i].visible = false;
        }

        for(i = 0; i < selectedLayers.length; i++) {
            selectedLayers[i].visible = true;
            var exportingFile = new File(ingDocPath + "/" + ingDocNameHyphen + "_" + (i + 1) + ".png");
            ingDoc.exportDocument(exportingFile, ExportType.SAVEFORWEB, options);
            exportingFile.rename(ingDocName + "_" + (i + 1) + ".png");
            selectedLayers[i].visible = false;
        }

        executeAction(app.stringIDToTypeID('revert'), undefined, DialogModes.NO);
        alert("레이어 " + selectedLayers.length + "개 PNG로 저장");
        return;
    }

    pngSavePerLayer();    


} catch (e) {
    alert("[Cache error] \n 최상위 레이어 or 그룹을 선택하고 다시 실행해주세요.");
}