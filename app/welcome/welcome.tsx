import mainImage from "../assets/main-image.jpg";

export function Welcome() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <img src={mainImage} alt="Main Image" className="w-full h-full" />
    </main>
  );
}
