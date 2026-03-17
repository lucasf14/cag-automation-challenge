export function generateEmployee() {
  const id = Date.now().toString().slice(-10);
  const firstName = `Lemmy_${id}`;
  const lastName = `Kilmister_${id}`;
  return { firstName, lastName, id };
}
