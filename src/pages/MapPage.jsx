import { useEffect, useRef, useState } from 'react';

const MapPage = () => {
  const magnifyRef = useRef(null);
  const largeRef = useRef(null);
  const [nativeDimensions, setNativeDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const loadImageDimensions = () => {
      const img = new Image();
      img.src = "https://annamalaiuniversity.ac.in/images/Campusmap.jpg";
      img.onload = () => {
        setNativeDimensions({ width: img.width, height: img.height });
      };
    };
    loadImageDimensions();
  }, []);

  const handleMouseMove = (e) => {
    if (!nativeDimensions.width || !nativeDimensions.height) return;

    const magnify = magnifyRef.current;
    const large = largeRef.current;
    const small = magnify.querySelector('.small');

    const magnifyRect = magnify.getBoundingClientRect();
    const mx = e.pageX - magnifyRect.left - window.scrollX;
    const my = e.pageY - magnifyRect.top - window.scrollY;

    if (mx < magnifyRect.width && my < magnifyRect.height && mx > 0 && my > 0) {
      large.style.display = 'block';
    } else {
      large.style.display = 'none';
      return;
    }

    const rx = Math.round((mx / small.width) * nativeDimensions.width - large.offsetWidth / 2) * -1;
    const ry = Math.round((my / small.height) * nativeDimensions.height - large.offsetHeight / 2) * -1;
    const bgp = `${rx}px ${ry}px`;

    const px = mx - large.offsetWidth / 2;
    const py = my - large.offsetHeight / 2;

    large.style.left = `${px}px`;
    large.style.top = `${py}px`;
    large.style.backgroundPosition = bgp;
  };

  return (
    <div className="magnify w-[950px] my-12 mx-auto relative" ref={magnifyRef} onMouseMove={handleMouseMove}>
      <div
        className="large w-[700px] h-[700px] absolute rounded-full shadow-[0_0_0_7px_rgba(255,255,255,0.85),0_0_7px_7px_rgba(0,0,0,0.25),inset_0_0_40px_2px_rgba(0,0,0,0.25)] hidden"
        style={{ background: "url('https://annamalaiuniversity.ac.in/images/Campusmap.jpg') no-repeat" }}
        ref={largeRef}
      ></div>
      <img
        className="small w-[950px] h-[618px]"
        src="https://annamalaiuniversity.ac.in/images/Campusmap.jpg"
        width="950"
        height="618"
        alt="Campus Map"
      />
    </div>
  );
};

export default MapPage;