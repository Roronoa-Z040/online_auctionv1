const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const { expect } = chai;

const { createAuction, getAuctionById } = require('../controllers/auctionController');
const Auction = require('../models/Auction');

describe('Auction Controller Tests', () => {
  afterEach(() => sinon.restore());

  it('createAuction -> should create auction successfully', async () => {
    const userId = new mongoose.Types.ObjectId();
    const req = {
      user: { _id: userId },
      body: { title: 'Test Auction', startingPrice: 100, endDate: new Date() }
    };

    const created = { _id: new mongoose.Types.ObjectId(), ...req.body, createdBy: userId };
    const stub = sinon.stub(Auction, 'create').resolves(created);

    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await createAuction(req, res);

    expect(stub.calledOnce).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(created)).to.be.true;
  });

  it('createAuction -> should return 500 on error', async () => {
    sinon.stub(Auction, 'create').throws(new Error('DB Error'));
    const req = { user: { _id: new mongoose.Types.ObjectId() }, body: { title: 'Bad', startingPrice: 1, endDate: new Date() } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await createAuction(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });

  it('getAuctionById -> should return 404 if not found', async () => {
    sinon.stub(Auction, 'findById').returns({ populate: sinon.stub().resolves(null) });

    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await getAuctionById(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Auction not found' })).to.be.true;
  });
});
