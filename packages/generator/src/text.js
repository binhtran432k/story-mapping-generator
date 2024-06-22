/**
 * @typedef {import("./types").Size} Size
 */

/**
 * @param {string} text
 * @returns {Size}
 */
export function getTextSize(text) {
	const width = Math.ceil([...text].reduce((p, c) => p + getSingleWidth(c) / 100, 0));
	const height = 16;
	return { width, height };
}

/**
 * @param {string} char
 */
function getSingleWidth(char) {
	const asciiSize = getAsciiWidth(char);
	if (asciiSize !== 0) return asciiSize;

	const c = char.charCodeAt(0);

	if (c == 0xa1) return getAsciiWidth('!');
	if ([0xb4, 0xb8].includes(c)) return getAsciiWidth('`');
	if (0xa2 <= c && c <= 0xa5) return getAsciiWidth('0');
	if (0xc0 <= c && c <= 0xc5) return getAsciiWidth('A');
	if (0xc8 <= c && c <= 0xcb) return getAsciiWidth('E');
	if (0xd2 <= c && c <= 0xd6) return getAsciiWidth('O');
	if (c == 0xd8) return getAsciiWidth('O');
	if (0xd9 <= c && c <= 0xdd) return getAsciiWidth('U');
	if (0xe0 <= c && c <= 0xe5) return getAsciiWidth('a');
	return 1500;
}

/**
 * @param {string} char
 */
function getAsciiWidth(char) {
	switch (char) {
		case ' ':
			return 500;
		case '!':
			return 410;
		case '"':
			return 430;
		case '#':
			return 990;
		case '$':
			return 900;
		case '%':
			return 1170;
		case '&':
			return 1000;
		case "'":
			return 200;
		case '(':
		case ')':
			return 560;
		case '*':
			return 690;
		case '+':
			return 910;
		case ',':
			return 320;
		case '-':
			return 440;
		case '.':
			return 420;
		case '/':
			return 490;
		case '0':
		case '1':
		case '2':
		case '3':
		case '4':
		case '5':
		case '6':
		case '7':
		case '8':
		case '9':
			return 900;
		case ':':
			return 390;
		case ';':
			return 340;
		case '<':
			return 820;
		case '=':
			return 880;
		case '>':
			return 840;
		case '?':
			return 760;
		case '@':
			return 1440;
		case 'A':
			return 1050;
		case 'B':
			return 1000;
		case 'C':
			return 1040;
		case 'D':
			return 1050;
		case 'E':
			return 910;
		case 'F':
			return 890;
		case 'G':
			return 1090;
		case 'H':
			return 1140;
		case 'I':
			return 440;
		case 'J':
			return 890;
		case 'K':
			return 1010;
		case 'L':
			return 860;
		case 'M':
			return 1400;
		case 'N':
			return 1140;
		case 'O':
			return 1100;
		case 'P':
			return 1010;
		case 'Q':
			return 1100;
		case 'R':
			return 990;
		case 'S':
			return 950;
		case 'T':
			return 970;
		case 'U':
			return 1040;
		case 'V':
			return 1020;
		case 'W':
			return 1420;
		case 'X':
			return 1010;
		case 'Y':
			return 980;
		case 'Z':
			return 960;
		case '[':
		case ']':
			return 430;
		case '\\':
			return 670;
		case '^':
			return 680;
		case '_':
			return 740;
		case '`':
			return 510;
		case 'a':
			return 880;
		case 'b':
			return 910;
		case 'c':
			return 850;
		case 'd':
			return 910;
		case 'e':
			return 860;
		case 'f':
			return 570;
		case 'g':
			return 910;
		case 'h':
			return 890;
		case 'i':
			return 400;
		case 'j':
			return 390;
		case 'k':
			return 820;
		case 'l':
			return 400;
		case 'm':
			return 1420;
		case 'n':
			return 900;
		case 'o':
			return 930;
		case 'p':
			return 910;
		case 'q':
			return 920;
		case 'r':
			return 550;
		case 's':
			return 840;
		case 't':
			return 540;
		case 'u':
			return 900;
		case 'v':
			return 790;
		case 'w':
			return 1220;
		case 'x':
			return 810;
		case 'y':
			return 770;
		case 'z':
			return 810;
		case '{':
		case '}':
			return 560;
		case '|':
			return 400;
		case '~':
			return 1100;
	}
	return 0;
}
