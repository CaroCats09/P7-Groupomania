// Fonction permettant de rendre un lien cliquable dans une chaîne de caractères

export default function ClickLink(text) {
    const exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig; // eslint-disable-line
    const text1 = text.replace(exp, "<a href='$1'>$1</a>");
    const exp2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim; // eslint-disable-line
    return text1.replace(exp2, '$1<a target="_blank" href="http://$2">$2</a>');
}