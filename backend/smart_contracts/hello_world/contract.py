import beaker
import pyteal as pt


class DemoState:
    algo = beaker.GlobalStateValue(pt.TealType.uint64)
    address = beaker.GlobalStateValue(pt.TealType.bytes)


app = beaker.Application("hello_world", state=DemoState())


@app.external
def hello(name: pt.abi.String, *, output: pt.abi.String) -> pt.Expr:
    return output.set(pt.Concat(pt.Bytes("Hello, "), name.get()))


@app.external
def deposit(address: pt.abi.String, *, output: pt.abi.String) -> pt.Expr:
    app.state.algo.set(pt.Txn.amount())
    app.state.address.set(address.get())
    return output.set(pt.Bytes("OK"))
