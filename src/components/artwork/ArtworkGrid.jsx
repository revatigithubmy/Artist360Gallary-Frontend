import ArtworkCard from './ArtworkCard';

const ArtworkGrid = ({ artworks }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {artworks.map(art => (
        <ArtworkCard key={art.id} artwork={art} />
      ))}
    </div>
  );
};

export default ArtworkGrid;