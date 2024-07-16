const Carte = () => {
  return (
    <div>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10709.455628394846!2d-3.0507784302246104!3d47.851915099999985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48103908328d4aa1%3A0xdb560cf33acf6f2e!2sF%C3%AAte%20des%20vieux%20m%C3%A9tiers%20-%20Keroguic!5e0!3m2!1sfr!2ses!4v1720971121142!5m2!1sfr!2ses"
        className="w-full h-[600px] border-none"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default Carte;
