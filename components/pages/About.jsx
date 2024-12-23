import {server} from "../../lib/config";
import Meta from "../core/Meta";

export default function AboutContent() {
  return (
      <>
        <Meta
            title="About | Quran Tube"
            description="Discover the beauty of Quran recitations through videos with Quran.tube"
            url={server}
            image={`${server}/img/logo/default_share.png`}
            type="website"
        />

        <div className="container mx-auto p-6">
          <p className="text-lg text-center mb-6">
            Discover the beauty of Quran recitations through videos with Quran.tube. Whether looking for heartfelt recitations by renowned Reciters, exploring various styles, or seeking Quran translations, Quran.tube has it all. Delve deeper into the teachings of the Quran with categorized videos featuring recitations, translations, and Quran learning resources designed for all levels.
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
            <div className="mt-2">
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
            <div className="mt-2 pb-6">
              <span>Support Us: </span>
              <a
                  className="text-blue-500 underline"
                  href="https://www.deeniinfotech.com/donate#donation-form"
                  target="_blank"
                  rel="noopener noreferrer"
              >
                Click here to donate!
              </a>
            </div>
          </div>
        </div>
        </>
  );
}
