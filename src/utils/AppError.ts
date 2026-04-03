export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string) {
    // Memanggil constructor dari class Error bawaan Node.js
    super(message);

    this.statusCode = statusCode;

    // isOperational = true menandakan bahwa error ini adalah error yang bisa kita prediksi
    // (misal: "Dokumen tidak ditemukan", "Password salah", "Input tidak valid").
    // Jika isOperational = false, berarti itu adalah bug/crash tak terduga di server.
    this.isOperational = true;

    // Menjaga stack trace tetap bersih, tidak memasukkan class AppError ini ke dalam log
    Error.captureStackTrace(this, this.constructor);
  }
}
