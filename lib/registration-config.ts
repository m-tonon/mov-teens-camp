export function isRegistrationOpen(): boolean {
  return process.env.NEXT_PUBLIC_REGISTRATIONS_OPEN === 'true';
}
