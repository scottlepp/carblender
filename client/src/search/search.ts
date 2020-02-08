export async function search() {
  const res = await fetch('http://localhost:5000/api?make=Porsche&model=Panamera&pmin=10000&pmax=40000');
  return (await res).json();
}