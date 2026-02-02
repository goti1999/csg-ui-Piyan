const currentUser = user.email.split('@')[0];
const pushTransportDispoTimestamp = new Date().toISOString();

return {
  user: currentUser,
  pushTransportDispoTimestamp
};
