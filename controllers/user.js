exports.getProfile = (req, res) => {
  //when isAuth/isAdmin middleware is checked the req.profile should be set with user details
  //req.profile = user details

  res.json(req.profile);
};
