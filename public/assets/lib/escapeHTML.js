function escapeHTML(string) {
    string = String(string).replace('&', "&amp;");
    string = string.replace('>', "&gt;");
    string = string.replace('<', "&lt;");
    string = string.replace('"', "&quot;");
    string = string.replace("'", "&#039;");
    return string;
}