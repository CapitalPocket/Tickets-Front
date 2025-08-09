export function formatMonth(texto: string) {
    const meses: any = {
        "enero": "01", "febrero": "02", "marzo": "03", "abril": "04",
        "mayo": "05", "junio": "06", "julio": "07", "agosto": "08",
        "septiembre": "09", "octubre": "10", "noviembre": "11", "diciembre": "12"
    };

    const partes = texto.toLowerCase().split(" de ");
    const mes = meses[partes[0]];
    const año = partes[1];

    return `${año}-${mes}`;
}