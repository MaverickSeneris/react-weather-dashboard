function generateUUID() {
  return Math.random().toString(36).substring(2, 7);
}


export default generateUUID;