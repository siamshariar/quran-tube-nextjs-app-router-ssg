export default function AboutContent() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-4">Quran Radio</h1>
      <p className="text-lg text-center mb-6">
        Discover the beauty of Quranic recitations with Qurn.radio, a platform
        that provides a diverse range of live radio and reciters. Immerse
        yourself in the authenticity of real-time broadcasts in the Live mode,
        or enjoy the serenity of recorded recitations in the Reciters mode.
        Additionally, enjoy the convenience of saving favorites and tracking
        your previous listening sessions. Explore the beauty of the Quran at
        your fingertips.
      </p>
      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="text-lg mb-4">
          Developed and maintained by Deeni Info Tech - A non-profit Software
          Development organization to spread the message of Islam worldwide.
        </p>
        <p className="text-lg mb-4">
          Deeni Info Tech is working towards these goals:
        </p>
        <ol className="list-decimal list-inside pl-4">
          <li>Applications for Scholars & Da&apos;wah organizations</li>
          <li>Applications for Non-Muslim Countries</li>
          <li>Develop Islamic applications</li>
        </ol>
        <p className="text-lg mt-4">
          Our primary goal is to create more promising Islamic applications. All
          our applications are/will be free of charge and entirely ad-free.
        </p>
        <div className="mt-6">
          <span>Website: </span>
          <a
            className="text-blue-500 underline"
            href="https://www.deeniinfotech.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.DeeniInfoTech.com
          </a>
        </div>
        <div className="mt-2 pb-6">
          <span>Email: </span>
          <a
            className="text-blue-500 underline"
            href="mailto:info@deeniinfotech.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            info@deeniinfotech.com
          </a>
        </div>
      </div>
    </div>
  );
}
