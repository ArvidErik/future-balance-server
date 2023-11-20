import Transaction from "../models/Transaction.js";
import TransactionFamily from "../models/TransactionFamily.js";

export const createTransaction = async (req, res) => {

  const { name, amount, from, to, type, ownerId } = req.body;
  const transactions = transactionGenerate(name, amount, from, to, type, ownerId)
  const transactionFamily = {
    name: name,
    amount: amount,
    from: from,
    to: to,
    type: type,
    owner: ownerId
  }

  try {
    const createdTransactions = await Transaction.create(transactions)
    const createdTransactionFamily = await TransactionFamily.create(transactionFamily)
    res.status(200).json(createdTransactions)
  } catch (err) {
    res.status(404).json({ message: err.message });
  }

};

export const getTransactionFamilies = async (req, res) => {

  const output = []
  const userid = req.headers.userid

  try {
    const getTransactions = await TransactionFamily.find({owner: userid})
    getTransactions.forEach((transaction)=>{
      const unit = {
        _id: transaction._id,
        name: transaction.name,
        amount: transaction.amount,
        from: transaction.from,
        to: transaction.to
      }
      output.push(unit)
    })

    res.status(200).json(output)
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};



//FUNCTIONS

function transactionGenerate(name, amount, from, to, type, ownerId) {
  const output = [];
  const startDate = new Date(`${from}`);
  const numberOfMonths = calculateMonthsDifference(from, to);

  for (let i = 1; i < numberOfMonths + 2; i++) {
    const currentMonth = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + i,
      1
    );

    output.push({
      name: name,
      amount: amount,
      dueDate: currentMonth,
      type: type,
      owner: ownerId
    });
  }

  return output;
}

function calculateMonthsDifference(from, until) {
    // Convert the input strings to Date objects
    const fromDate = new Date(`${from}`);
    const untilDate = new Date(`${until}`);
    let monthsDifference

    // Calculate the difference in months
    if ((untilDate.getFullYear()-fromDate.getFullYear()) >1) {
        monthsDifference = (untilDate.getFullYear() - fromDate.getFullYear()) * 12 +
            (untilDate.getMonth() - fromDate.getMonth());
    } else if ((untilDate.getFullYear()-fromDate.getFullYear()) == 1 && untilDate.getMonth() - fromDate.getMonth() > 0) {
        monthsDifference = (untilDate.getFullYear() - fromDate.getFullYear()) * 12 +
        (untilDate.getMonth() - fromDate.getMonth());
    } else {
        monthsDifference = untilDate.getMonth() - fromDate.getMonth()
    }

    return monthsDifference;
}