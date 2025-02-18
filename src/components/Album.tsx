import { memories } from '../data/dataImage';
import AlbumHeader from './Navbar';

const Album: React.FC = () => {
    return (
        <AlbumHeader
            totalMemories={memories.length}
        />
    );
};

export default Album;