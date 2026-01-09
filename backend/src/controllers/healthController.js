const getHealth = (req, res) => {
    res.status(200).send('Server is running');
};

module.exports = { getHealth };
