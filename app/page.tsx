import dataset from '../data/articles.json';
import Digest from './digest';
export default function Page(){return <Digest dataset={dataset}/>}
