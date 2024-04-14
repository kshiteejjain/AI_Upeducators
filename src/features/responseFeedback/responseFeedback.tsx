import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';
import ThumbsUp from '../../assets/thumb-up.svg';

import  './responseFeedback.css';

const responseFeedback = () => {
    const likeResponse = async () => {
        const curForm = localStorage.getItem('curForm');
    
        if (!curForm) {
            return;
        }
        const collectionRef = collection(firestore, 'FormsList');
        const q = query(collectionRef, where('name', '==', curForm));
        const querySnapshot = await getDocs(q);
    
        if (querySnapshot.empty) {
            return;
        }
    
        querySnapshot.forEach(async (document) => {
            const newLikes = document.data().likes ? document.data().likes + 1 : 1;  // Handle undefined likes
            await updateDoc(doc(firestore, 'FormsList', document.id), {
                likes: newLikes
            }).then(() => {
            }).catch((error) => {
                console.error("Error updating likes:", error);  // Log any errors during update
            });
        });
    };
    

    const needImprovement = async () => {
        const curForm = localStorage.getItem('curForm');
        
        if (!curForm) {
            console.log("No current form found in localStorage");
            return;
        }
    
        const collectionRef = collection(firestore, 'FormsList');
        const q = query(collectionRef, where('name', '==', curForm));
        const querySnapshot = await getDocs(q);
    
        if (querySnapshot.empty) {
            console.log("No documents found matching the current form name.");
            return;
        }
    
        querySnapshot.forEach(async (document) => {
            // Assuming the correct field for dislikes or improvements is 'dislikes'
            const currentDislikes = document.data().dislikes ? document.data().dislikes + 1 : 1;
            await updateDoc(doc(firestore, 'FormsList', document.id), {
                dislikes: currentDislikes
            }).catch((error) => {
                console.error("Error updating dislikes:", error);  // Log any errors during update
            });
        });
    };
    
    

    return (
        <div className="response-feedback">
            <img src={ThumbsUp} alt='Like Response' title='Like Response' onClick={likeResponse} />
            <img src={ThumbsUp} alt='Need Improvement' title='Need Improvement' onClick={needImprovement} />
        </div>
    )
}

export default responseFeedback;
