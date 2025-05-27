import React from "react";
import { motion } from "framer-motion";
import BatchCard from "./BatchCard";
// import BatchCard from "./BatchCard"; // To be implemented

interface BatchGridProps {
  batches: any[];
  onCardClick: (index: number) => void;
}

const BatchGrid: React.FC<BatchGridProps> = ({ batches, onCardClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      key="batch-grid"
    >
      {batches.map((batch, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <BatchCard
            batch={batch}
            onClick={() => onCardClick(index)}
            index={index}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default BatchGrid;
