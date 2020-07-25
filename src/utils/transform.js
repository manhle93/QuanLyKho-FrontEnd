class Formate {
  formatCurrency(n, separate = ".") {
    try {
      if (!n) n = 0;
      var s = parseInt(n).toString();
      var regex = /\B(?=(\d{3})+(?!\d))/g;
      var ret = s.replace(regex, separate);
      return ret;
    } catch (error) {
      return "0";
    }
  }
}

export default Formate = new Formate()