import SculptureGallery from "./SculptureGallery";

export default function SculptureCard({ sculpture }) {
  return (
    <article className="bg-white rounded-2xl border border-sand-200 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
      <SculptureGallery
        media={sculpture.sculpture_media}
        date={sculpture.date}
      />
      <div className="p-5">
        <h3 className="text-lg font-semibold text-sand-900 mb-0.5">
          {sculpture.name}
        </h3>
        <p className="text-xs text-sand-500 font-medium mb-3">
          {sculpture.unit} &middot; גיל {sculpture.age}
        </p>
        <p className="text-sm text-sand-700 leading-relaxed line-clamp-3">
          {sculpture.story}
        </p>
      </div>
    </article>
  );
}
