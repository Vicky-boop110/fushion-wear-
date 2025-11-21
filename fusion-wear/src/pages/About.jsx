const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
          <h1 className="text-4xl font-bold text-navy mb-6">About Fusion Wear</h1>
          
          <div className="prose max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4">Our Story</h2>
              <p className="leading-relaxed">
                Fusion Wear was born from a simple idea: everyone deserves to express their unique style through 
                high-quality, customizable clothing. We believe that fashion should be personal, accessible, and 
                sustainable. Since our founding, we've been committed to providing premium T-shirts that combine 
                comfort, style, and the ability to make them truly yours.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4">Our Mission</h2>
              <p className="leading-relaxed">
                Our mission is to empower individuals to express their creativity through customizable fashion. 
                We strive to offer the highest quality materials, innovative design tools, and exceptional customer 
                service. We're committed to sustainability, ethical manufacturing, and creating products that our 
                customers will love and cherish for years to come.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4">Quality Materials</h2>
              <p className="leading-relaxed mb-4">
                We offer three tiers of quality to suit every need and budget:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Regular:</strong> High-quality cotton blend, perfect for everyday wear. Soft, durable, and affordable.</li>
                <li><strong>Premium:</strong> Premium cotton with enhanced durability and comfort. Ideal for those who want the best value.</li>
                <li><strong>Designer:</strong> Top-tier materials with superior fit, feel, and longevity. For those who demand the finest quality.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4">Customization</h2>
              <p className="leading-relaxed">
                Our easy-to-use design editor allows you to upload your own images, add custom text, choose from 
                a variety of fonts and colors, and see your design in real-time. Whether you're creating a gift, 
                team uniform, or personal statement piece, our customization tools make it simple and fun.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4">Sustainability</h2>
              <p className="leading-relaxed">
                We're committed to sustainable practices throughout our supply chain. We work with ethical manufacturers, 
                use eco-friendly materials where possible, and minimize waste in our production process. When you choose 
                Fushon Wear, you're choosing a brand that cares about the planet.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About

