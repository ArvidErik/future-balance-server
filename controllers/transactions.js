import Transaction from "../models/Transaction.js";
import TransactionFamily from "../models/TransactionFamily.js";

export const createTransaction = async (req, res) => {
  const { name, amount, from, to, type, ownerId } = req.body;
  const transactionFamily = {
    name: name,
    amount: amount,
    from: from,
    to: to,
    type: type,
    owner: ownerId,
  };

  try {
    const createdTransactionFamily = await TransactionFamily.create(
      transactionFamily
    );
    const transactions = transactionGenerate(
      name,
      amount,
      from,
      to,
      type,
      ownerId,
      createdTransactionFamily._id
    );
    const createdTransactions = await Transaction.create(transactions);
    res.status(200).json(createdTransactions);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getTransactionFamilies = async (req, res) => {
  const output = [];
  const userid = req.headers.userid;

  try {
    const getTransactions = await TransactionFamily.find({ owner: userid });
    getTransactions.forEach((transaction) => {
      const unit = {
        _id: transaction._id,
        name: transaction.name,
        amount: transaction.amount,
        from: transaction.from,
        to: transaction.to,
        type: transaction.type,
      };
      output.push(unit);
    });

    res.status(200).json(output);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getTransactions = async (req, res) => {
  const output = [];
  const userid = req.headers.userid;

  try {
    const getTransactions = await Transaction.find({ owner: userid });
    getTransactions.forEach((transaction) => {
      const unit = {
        _id: transaction._id,
        name: transaction.name,
        amount: transaction.amount,
        dueDate: transaction.dueDate,
        type: transaction.type,
        owner: transaction.owner,
      };
      output.push(unit);
    });

    res.status(200).json(output);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getBalanceData = async (req, res) => {
  const userid = req.headers.userid;

  try {
    const getTransactions = await Transaction.find({ owner: userid });
    const result = sumTransactionsByMonth(getTransactions);
    const output = sortTransactions(result);
    const balance = balanceCalculation(output);
    res.status(200).json(balance);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getCurrentBalance = async (req, res) => {
  const userid = req.headers.userid;

  try {

    const getTransactions = await Transaction.find({ owner: userid });
    const result = sumTransactionsByMonth(getTransactions);
    const output = sortTransactions(result);
    const balance = balanceCalculation(output);


    const date = new Date(Date.now())
    const formattedDate = `${(
      date.getMonth() + 1
    ).toString()}-${date.getFullYear()}`

    const element = balance.find((obj) =>
        Object.values(obj).includes(formattedDate))


    res.status(200).json(element);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const deleteTransaction = async (req, res) => {
  const userid = req.headers.userid;
  const {transactionId} = req.body

  try {
    const deleteTransactionFamily = await TransactionFamily.deleteOne({_id: transactionId})
    const deleteTransactions = await Transaction.deleteMany({family: transactionId})
    res.status(200).json(deleteTransactions)
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

//FUNCTIONS

function transactionGenerate(name, amount, from, to, type, ownerId, family) {
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
      owner: ownerId,
      family: family
    });
  }

  return output;
}

function calculateMonthsDifference(from, until) {
  // Convert the input strings to Date objects
  const fromDate = new Date(`${from}`);
  const untilDate = new Date(`${until}`);
  let monthsDifference;

  // Calculate the difference in months
  if (untilDate.getFullYear() - fromDate.getFullYear() > 1) {
    monthsDifference =
      (untilDate.getFullYear() - fromDate.getFullYear()) * 12 +
      (untilDate.getMonth() - fromDate.getMonth());
  } else if (
    untilDate.getFullYear() - fromDate.getFullYear() == 1 &&
    untilDate.getMonth() - fromDate.getMonth() > 0
  ) {
    monthsDifference =
      (untilDate.getFullYear() - fromDate.getFullYear()) * 12 +
      (untilDate.getMonth() - fromDate.getMonth());
  } else {
    monthsDifference = untilDate.getMonth() - fromDate.getMonth();
  }

  return monthsDifference;
}

function sumTransactionsByMonth(transactions) {
  // Create an object to store the sum for each month
  const monthlySum = {};

  // Iterate through each transaction
  transactions.forEach((transaction) => {
    // Extract the month and year from the dueDate
    const date = new Date(transaction.dueDate);
    const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;

    // Check if the month is already a key in the monthlySum object
    if (monthlySum[monthYear]) {
      // If yes, add the amount to the existing sum
      if (transaction.type == "income") {
        monthlySum[monthYear] += transaction.amount;
      } else {
        monthlySum[monthYear] -= transaction.amount;
      }
    } else {
      // If no, create a new key and set the amount as the value
      if (transaction.type == "income") {
        monthlySum[monthYear] = transaction.amount;
      } else {
        monthlySum[monthYear] = -transaction.amount;
      }
    }
  });

  return monthlySum;
}

function sortTransactions(result) {
  const output = [];

  for (const key in result) {
    const obj = {
      x: key,
      y: result[key],
    };
    output.push(obj);
  }

  output.sort((a, b) => {
    if (a.x.substring(a.x.length - 4) < b.x.substring(b.x.length - 4)) {
      return -1;
    } else if (a.x.substring(a.x.length - 4) > b.x.substring(b.x.length - 4)) {
      return 1;
    } else {
      if (
        Number(a.x.substring(0, a.x.indexOf("-"))) <
        Number(b.x.substring(0, b.x.indexOf("-")))
      ) {
        return -1;
      } else if (
        Number(a.x.substring(0, a.x.indexOf("-"))) >
        Number(b.x.substring(0, b.x.indexOf("-")))
      ) {
        return 1;
      } else {
        return 0;
      }
    }
  });

  return output;
}

function balanceCalculation(output) {
  const currentDate = new Date();
  const monthsData = [];
  let prevValue = 0;

  for (let i = 0; i < 36; i++) {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(currentDate.getMonth() + i);

    const formattedDate = `${(
      nextMonth.getMonth() + 1
    ).toString()}-${nextMonth.getFullYear()}`;

    if (output.some((obj) => Object.values(obj).includes(formattedDate))) {
      const element = output.find((obj) =>
        Object.values(obj).includes(formattedDate)
      );
      prevValue = prevValue + Number(element.y);
    }

    // You can modify this part to include the specific values you need for each month
    const monthData = {
      x: formattedDate,
      y: prevValue,
    };

    monthsData.push(monthData);
  }
  return monthsData;
}
