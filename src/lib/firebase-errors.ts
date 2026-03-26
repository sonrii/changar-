/**
 * Firebase Error Messages
 * 
 * Mapea códigos de error de Firebase a mensajes user-friendly en español.
 */

export function getFirebaseErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    // Auth errors
    'auth/email-already-in-use': 'Este email ya está registrado',
    'auth/invalid-email': 'El email no es válido',
    'auth/operation-not-allowed': 'Operación no permitida',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
    'auth/user-not-found': 'No existe una cuenta con este email',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/invalid-credential': 'Email o contraseña incorrectos',
    'auth/too-many-requests': 'Demasiados intentos. Intentá más tarde',
    'auth/network-request-failed': 'Error de conexión. Verificá tu internet',
    
    // Firestore errors
    'permission-denied': 'No tenés permiso para realizar esta acción',
    'not-found': 'El documento no existe',
    'already-exists': 'El documento ya existe',
    'resource-exhausted': 'Se excedió el límite de uso',
    'failed-precondition': 'Operación no válida en el estado actual',
    'aborted': 'Operación cancelada por conflicto',
    'out-of-range': 'Operación fuera de rango válido',
    'unimplemented': 'Operación no implementada',
    'internal': 'Error interno del servidor',
    'unavailable': 'Servicio temporalmente no disponible',
    'data-loss': 'Pérdida de datos irrecuperable',
    'unauthenticated': 'Debés iniciar sesión para continuar',
  };

  return errorMessages[errorCode] || 'Ocurrió un error. Por favor intentá nuevamente';
}

export function handleFirebaseError(error: any): string {
  if (error.code) {
    return getFirebaseErrorMessage(error.code);
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'Ocurrió un error inesperado';
}
