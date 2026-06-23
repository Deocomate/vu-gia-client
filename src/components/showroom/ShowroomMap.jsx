import React from "react";

export default function ShowroomMap() {
  return (
    <section className="relative w-full showroom-map-container bg-neutral-100 overflow-hidden">
      {/* Google Map Embed Iframe */}
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.267812970921!2d105.9238384!3d20.9818818!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135af9e2a53ff33%3A0xe1adbfab1562e1ad!2zMTggR2lhbmcgQ2FvLCBCw6F0IFRyw6BuZywgR2lhIEzDom0sIEjDoCBO4buZaQ!5e0!3m2!1svi!2s!4v1718360000000!5m2!1svi!2s"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Bản đồ chỉ đường đến Showroom Gốm Sứ Vũ Gia"
        className="w-full h-full grayscale-[15%] contrast-[110%]"
      ></iframe>
    </section>
  );
}
