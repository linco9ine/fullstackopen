import axios from "axios";

const getAll = async () => {
  const res = await axios.get("/api/users");
  return res.data;
};

export default { getAll };
