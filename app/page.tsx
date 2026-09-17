

export default function Home() {
 fetch("http://localhost:3002/products")
  .then(response => response.json())
  .then(data => {
    console.log(data);
  });
  return (
    <div >
      <main>
        تست متن فارسی با فونت وزیر تن استفاده از سورس گوگل
        <br />
        Main page of site that contain Layaout(header ...) and products card and catagories
      </main>
    </div>
  );
}
