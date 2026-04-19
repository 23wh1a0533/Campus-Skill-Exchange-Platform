const calculateMatchPercentage = (userA, userB) => {
  let matches = 0;
  let total = 0;
  
  // A offers, B wants
  userA.skillsOffered.forEach(offered => {
    const matching = userB.skillsWanted.some(wanted => 
      wanted.name.toLowerCase() === offered.name.toLowerCase()
    );
    if (matching) matches++;
    total++;
  });
  
  // B offers, A wants
  userB.skillsOffered.forEach(offered => {
    const matching = userA.skillsWanted.some(wanted => 
      wanted.name.toLowerCase() === offered.name.toLowerCase()
    );
    if (matching) matches++;
    total++;
  });
  
  if (total === 0) return 0;
  return Math.round((matches / total) * 100);
};

module.exports = { calculateMatchPercentage };