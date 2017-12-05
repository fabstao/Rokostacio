
// *************************************
// (C) 2015 NUO Tecnologia S de RL de CV
// fabian@nuo.com.mx
// *************************************

var vlista = {
                imgs: ["logo1a.png","logo2b.png","logo3a.png","ecuacion1.png","ecuacion2.png",
                       "ecuacion3.png","ecuacion4.png","ecuacion5.png"],
                passp: ["c9f0f895fb98ab9159f51fd0297e236d", "c4ca4238a0b923820dcc509a6f75849b",
                        "3c59dc048e8850243be8079a5c74d079","6403558c0e945a72056d09ac3281f964",
                        "eccbc87e4b5ce2fe28308fd9f2a7baf3","27f237e6b7f96587b6202ff3607ad88a",
                        "eccbc87e4b5ce2fe28308fd9f2a7baf3","92c4cf9df4c01b73f7e757e78ae60841"]
             };
function generar() {
    var dado = Math.random();
    dado = Math.ceil(dado * 8)-1;
    var cimagen = document.getElementById("cimagen");
    var cgalleta = document.getElementById("cgalleta");
    var dbindex = document.getElementById("dbindex");
    cimagen.src="/images/"+vlista.imgs[dado];
    cgalleta.value=vlista.passp[dado];
    dbindex.value=dado;
    //alert(cgalleta.value);
}

function validar() {
    var cvalor = document.getElementById("cvalor");
    var dbindex = document.getElementById("dbindex");
    var passd=hex_md5(cvalor.value);
    var regresa=true;
    if(vlista.passp[dbindex.value]!==passd) {
        alert("Comprobación humana falló, probablemente seas un robot  (o_o) ");
        regresa=false;
        return false;
    }
    alert("¡Comprobación exitosa! No eres un robot :) . Click en aceptar para continuar");
    return regresa;
}