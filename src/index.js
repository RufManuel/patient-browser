import React         from "react"
import ReactDOM      from "react-dom"
import App           from "./components/App"
import { Provider }  from "react-redux"
import STORE         from "./redux"
import PatientDetail from "./components/PatientDetail"
import PatientList   from "./components/PatientList"
import DeviceDetail  from "./components/DeviceDetail"
import { Router, Route, Switch } from "react-router"
import createHistory from "history/createHashHistory"
import jQuery    from "jquery"

window.$ = window.jQuery = jQuery

const history = createHistory()

ReactDOM.render(
    <Provider store={STORE}>
        <Router history={history}>
            <Switch>
                <App>
                    <Route path="/"             component={PatientList} exact/>
                    <Route path="/patient/:id"  component={PatientDetail}/>
                    <Route path="/device/:id"   component={DeviceDetail}/>
                </App>
            </Switch>
        </Router>
    </Provider>,
    document.getElementById("main")
)

$(function () {
    $("body").tooltip({
        selector : ".patient-detail-page [title]"
    })
})