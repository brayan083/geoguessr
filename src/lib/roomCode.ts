/**
 * Genera un código de sala de 6 caracteres (letras mayúsculas y números, sin
 * caracteres ambiguos como 0/O o 1/I).
 */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateRoomCode(length = 6): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return code;
}
