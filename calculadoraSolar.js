// ============================================================
// GRS SOLARIS - CALCULADORA DE CONSUMO E SISTEMA FOTOVOLTAICO
// ============================================================

// Parâmetros técnicos utilizados na planilha
const RADIACAO_DIARIA = 5.126;       // kWh/m²/dia
const DIAS_ANO = 365;
const POTENCIA_MODULO = 550;         // Wp
const RENDIMENTO_MODULO = 0.213;     // 21,3%
const AREA_MODULO = 2.10;            // m²
const COEF_SISTEMA = 0.80;
const TARIFA = 0.95;                 // R$/kWh
const TARIFA_MINIMA = 50;            // kWh/mês


// ============================================================
// LISTA DOS 12 MESES
// ============================================================

const meses = [
    "janeiro",
    "fevereiro",
    "marco",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro"
];


// ============================================================
// FUNÇÃO PRINCIPAL
// ============================================================

function calcularSistemaSolar() {

    let consumos = [];
    let preenchimentoValido = true;


    // ========================================================
    // CAPTURA OS VALORES DOS 12 CAMPOS
    // ========================================================

    meses.forEach(function(mes) {

        let valor = document.getElementById(mes).value;

        // Converte o valor digitado de texto para número
        let consumo = parseFloat(valor);

        // Verifica se o valor é válido
        if (isNaN(consumo) || consumo < 0) {
            preenchimentoValido = false;
        }

        consumos.push(consumo || 0);
    });


    // ========================================================
    // VERIFICAÇÃO DOS CAMPOS
    // ========================================================

    const mensagem =
        document.getElementById("mensagemCalculadora");

    if (!preenchimentoValido) {

        mensagem.textContent =
            "Preencha todos os meses com valores válidos.";

        mensagem.className =
            "calculator-message erro";

        return;
    }


    // ========================================================
    // 1. DEMANDA ANUAL
    //
    // Soma dos 12 meses
    // ========================================================

    let demandaAnual = consumos.reduce(function(total, consumo) {

        return total + consumo;

    }, 0);


    // ========================================================
    // 2. DEMANDA MÉDIA MENSAL
    //
    // Soma dos meses dividida por 12
    // ========================================================

    let mediaMensal = demandaAnual / 12;


    // ========================================================
    // 3. RADIAÇÃO ANUAL
    //
    // Radiação diária × 365 dias
    // ========================================================

    const radiacaoAnual =
        RADIACAO_DIARIA * DIAS_ANO;


    // ========================================================
    // 4. GERAÇÃO ANUAL DE UM MÓDULO
    //
    // Radiação anual
    // × rendimento
    // × área do módulo
    // × coeficiente do sistema
    // ========================================================

    const geracaoAnualModulo =
        radiacaoAnual *
        RENDIMENTO_MODULO *
        AREA_MODULO *
        COEF_SISTEMA;


    // ========================================================
    // 5. GERAÇÃO MENSAL DE UM MÓDULO
    // ========================================================

    const geracaoMensalModulo =
        geracaoAnualModulo / 12;


    // ========================================================
    // 6. QUANTIDADE DE PLACAS PARA 100%
    //
    // Fórmula utilizada na planilha:
    //
    // INT(
    //   0,9 +
    //   (Demanda anual - 12 × tarifa mínima)
    //   / geração anual por módulo
    // )
    // ========================================================

    let placas100 =
        Math.floor(
            0.9 +
            (
                demandaAnual -
                (12 * TARIFA_MINIMA)
            ) /
            geracaoAnualModulo
        );


    // Evita quantidade negativa de placas
    if (placas100 < 0) {

        placas100 = 0;
    }


    // ========================================================
    // 7. POTÊNCIA INSTALADA
    //
    // Número de placas × 550 Wp
    // Dividido por 1000 para obter kWp
    // ========================================================

    const potenciaInstalada =
        (placas100 * POTENCIA_MODULO) / 1000;


    // ========================================================
    // 8. CONSUMO MENSAL ATUAL EM REAIS
    //
    // Média mensal × tarifa
    // ========================================================

    const consumoMensalAtual =
        mediaMensal * TARIFA;


    // ========================================================
    // 9. ECONOMIA MENSAL ESTIMADA
    //
    // Geração mensal por módulo
    // × quantidade de placas
    // × tarifa
    // ========================================================

    const economiaMensal =
        placas100 *
        geracaoMensalModulo *
        TARIFA;


    // ========================================================
    // ATUALIZA OS RESULTADOS NA PÁGINA
    // ========================================================

    document.getElementById("mediaMensal").textContent =
        formatarNumero(mediaMensal) + " kWh";


    document.getElementById("demandaAnual").textContent =
        formatarNumero(demandaAnual) + " kWh";


    document.getElementById("geracaoAnualModulo").textContent =
        formatarNumero(geracaoAnualModulo) + " kWh";


    document.getElementById("geracaoMensalModulo").textContent =
        formatarNumero(geracaoMensalModulo) + " kWh";


    document.getElementById("placas100").textContent =
        placas100 + " placas";


    document.getElementById("potenciaInstalada").textContent =
        formatarNumero(potenciaInstalada) + " kWp";


    document.getElementById("consumoMensalAtual").textContent =
        formatarMoeda(consumoMensalAtual);


    document.getElementById("economiaMensal").textContent =
        formatarMoeda(economiaMensal);


    // ========================================================
    // MENSAGEM DE SUCESSO
    // ========================================================

    mensagem.textContent =
        "Cálculo realizado com sucesso.";

    mensagem.className =
        "calculator-message sucesso";
}


// ============================================================
// FORMATAÇÃO DE NÚMEROS
// ============================================================

function formatarNumero(valor) {

    return valor.toLocaleString("pt-BR", {

        minimumFractionDigits: 2,

        maximumFractionDigits: 2
    });
}


// ============================================================
// FORMATAÇÃO DE VALORES EM REAIS
// ============================================================

function formatarMoeda(valor) {

    return valor.toLocaleString("pt-BR", {

        style: "currency",

        currency: "BRL"
    });
}


// ============================================================
// BOTÃO "CALCULAR SISTEMA SOLAR"
// ============================================================

document
    .getElementById("btnCalcularSolar")
    .addEventListener(
        "click",
        calcularSistemaSolar
    );