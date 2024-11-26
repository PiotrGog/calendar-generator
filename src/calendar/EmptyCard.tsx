import React from 'react';

import styles from './Card.module.css';

class EmptyCard extends React.Component<{}, {}> {
    render() {
        return (
            <div className={styles.cardContainer}>
            </div>
        )
    }
}

export default EmptyCard;
