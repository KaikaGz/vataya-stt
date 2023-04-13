// หน้าสำหรับจัดการบอทโดยการลาก Dialog ได้
import Page from "components/Page";
import React, { Component } from "react";
import LinkAssistant from "components/LinkAssistant";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Button,
  CardFooter,
  Modal,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  CustomInput,
  ModalHeader,
} from "reactstrap";
import { apiUrl, editorUrl, checkSession } from "../assets/config/config_const";
import swal from "sweetalert";
import Swal from "sweetalert2";
import {
  Widget,
  addResponseMessage,
  toggleWidget,
  dropMessages,
} from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import { Fab, Action } from "react-tiny-fab";
import "react-tiny-fab/dist/styles.css";
import { FaMicrophone } from "react-icons/fa";
import mascot from "../assets/img/logo/mascot.png";
import "../assets/css/style.css";
import { GrReddit } from "react-icons/gr";

const fabStyles = {
  right: 100,
  zIndex: 999,
  // top: 699,
  bottom: 0,
  position: "fixed",
  display: "flex",
};

export default class BotsUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todo: [],
      done: [],
      modal: false,
      botToken: "",
      topic: [],
      dialog: [],
      checked: [],
      search: "",
      searchDialog: "",
      messageList: [],
      chatPopup: false,
      nameTestBot: "",
      botTokenTest: "",
      chatSID: "",
      showAssistant: false,
    };

    this.toggle = this.toggle.bind(this);

    this.chatToggle = this.chatToggle.bind(this);

    this.assistantToggle = this.assistantToggle.bind(this);

    this.fabButtonClick = this.fabButtonClick.bind(this);
  }

  fabButtonClick() {
    this.setState({
      showAssistant: true,
    });
    console.log(this.state.showAssistant);
  }

  toggle() {
    Swal.fire({
      title: "Do you want to launch this bot?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "rgb(84, 124, 195)",
      cancelButtonColor: "rgb(236, 71, 54)",
      confirmButtonText: "Yes, launch!",
    }).then((result) => {
      // console.log(result.value);
      if (result.value) {
        this.getMatchingContent();
      }
    });
  }

  chatToggle() {
    // console.log("hi");
    const query = new URLSearchParams(window.location.search);
    const bot_id = query.get("bot_id");
    const {
      id,
      fullname,
      org_code,
      role,
      org_id,
      org_name,
      email,
    } = JSON.parse(localStorage.getItem("login"));

    // const org_code = "ai9";

    if (!this.state.chatPopup) {
      const dialogs = this.state.todo.map((v) => v.id);

      var generator = require("generate-password");
      const shortName = generator.generate({
        length: 8,
        numbers: true,
        lowercase: true,
        uppercase: true,
      });

      // const namor = require("namor");
      // const shortName = namor.generate({
      //   words: 1,
      //   subset: "manly",
      //   saltLength: 0,
      // });
      const nameTestBot = `dev-${shortName}`;

      this.setState({ nameTestBot });
      // //console.log(nameTestBot);
      const bot_code = nameTestBot;

      var generator = require("generate-password");
      const chatSID = generator.generate({
        length: 6,
        numbers: true,
        lowercase: true,
        uppercase: true,
      });

      this.setState({ chatSID });

      checkSession({
        // url:`/api/bot/content/get/${bot_id}`,
        url: "/api/dialog/content/getMatching",
        method: "POST",
        body: JSON.stringify({ dialogs }),
        response: (results) =>
          results.json().then(({ intent, tag, parameter, table }) => {
            fetch(`${apiUrl}/api/auth/genBotJWT`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id,
                fullname,
                org_code,
                role,
                org_id,
                org_name,
                email,
                bot_code,
              }),
            }).then((response) => {
              response.json().then(({ botToken }) => {
                this.setState({ botTokenTest: botToken });
                console.log("bot test", botToken);
                // //console.log(JSON.stringify({ bot: bot_code, intent, tag }));
                fetch(`${editorUrl}/${org_code}/engine/api/v1.1/test/run`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "x-access-token": this.state.botTokenTest,
                  },
                  redirect: "follow",
                  body: JSON.stringify({
                    bot: bot_code,
                    intent,
                    tag,
                    parameter,
                    table,
                  }),
                }).then((response) => {
                  response.json().then((result) => {
                    // console.log("result test", result);
                  });
                });
              });
            });
          }),
      });
    } else {
      // //console.log("remove bot: ", this.state.nameTestBot);
      fetch(`${editorUrl}/${org_code}/engine/api/v1.1/test/drop`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": this.state.botTokenTest,
        },
        redirect: "follow",
        body: JSON.stringify({ bot: this.state.nameTestBot }),
      }).then((response) => {
        response.json().then((result) => {
          console.log("result drop", result);
          dropMessages();
        });
      });
    }
    this.setState({ chatPopup: !this.state.chatPopup });
    // toggleWidget();
  }

  assistantToggle() {
    const query = new URLSearchParams(window.location.search);
    const bot_id = query.get("bot_id");
    const {
      id,
      fullname,
      org_code,
      role,
      org_id,
      org_name,
      email,
    } = JSON.parse(localStorage.getItem("login"));

    const dialogs = this.state.todo.map((v) => v.id);

    var generator = require("generate-password");
    const shortName = generator.generate({
      length: 8,
      numbers: true,
      lowercase: true,
      uppercase: true,
    });

    const nameTestBot = `dev-${shortName}`;

    this.setState({ nameTestBot });

    const bot_code = nameTestBot;

    var generator = require("generate-password");
    const chatSID = generator.generate({
      length: 6,
      numbers: true,
      lowercase: true,
      uppercase: true,
    });

    this.setState({ chatSID });

    checkSession({
      // url:`/api/bot/content/get/${bot_id}`,
      url: "/api/dialog/content/getMatching",
      method: "POST",
      body: JSON.stringify({ dialogs }),
      response: (results) =>
        results.json().then(({ intent, tag, parameter, table }) => {
          fetch(`${apiUrl}/api/auth/genBotJWT`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id,
              fullname,
              org_code,
              role,
              org_id,
              org_name,
              email,
              bot_code,
            }),
          }).then((response) => {
            response.json().then(({ botToken }) => {
              this.setState({ botTokenTest: botToken });
              // console.log("bot test", botToken);
              // //console.log(JSON.stringify({ bot: bot_code, intent, tag }));
              fetch(`${editorUrl}/${org_code}/engine/api/v1.1/test/run`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-access-token": this.state.botTokenTest,
                },
                redirect: "follow",
                body: JSON.stringify({
                  bot: bot_code,
                  intent,
                  tag,
                  parameter,
                  table,
                }),
              }).then((response) => {
                response.json().then((result) => {
                  // console.log("result test", result);
                });
              });
            });
          });
        }),
    });
  }

  handleNewUserMessage = (newMessage) => {
    // console.log(JSON.stringify({ sid: this.state.chatSID, text: newMessage }));
    const { org_code } = JSON.parse(localStorage.getItem("login"));
    // const org_code = "ai9";
    //console.log("analyze: ", this.state.botTokenTest);
    fetch(`${editorUrl}/${org_code}/engine/api/v1.1/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": this.state.botTokenTest,
      },
      body: JSON.stringify({ sid: this.state.chatSID, text: newMessage }),
    })
      .then((results) => results.json())
      .then(({ response_text }) => {
        if (response_text) {
          // console.log(response_text);
          addResponseMessage(response_text || "");
        }
      })
      .catch((e) => console.log("error", e));
  };

  getTopicList() {
    checkSession({
      url: "/api/topic/list",
      method: "GET",
      response: (results) =>
        results.json().then(({ data }) => {
          if (data) {
            this.setState({ topic: data });
          }
        }),
    });
  }

  getDialogList() {
    const query = new URLSearchParams(window.location.search);
    const bot_id = query.get("bot_id");

    const { org_id } = JSON.parse(localStorage.getItem("login"));

    checkSession({
      url: "/api/dialog/match",
      method: "POST",
      body: JSON.stringify({ org_id: org_id, bot_id: bot_id }),
      response: (results) =>
        results.json().then(({ data }) => {
          if (data) {
            Promise.all(
              data.map((v) => ({
                id: v.dialog_id,
                name: v.dialog_name,
                topic_id: v.topic_id,
                bgcolor: "hsla(204.8,53%,50.8%,0.7)",
              }))
            ).then((newData) =>
              this.setState({ done: [...this.state.done, ...newData] })
            );
          }
        }),
    });
  }

  getMatching() {
    const query = new URLSearchParams(window.location.search);
    const bot_id = query.get("bot_id");
    //console.log(bot_id);

    checkSession({
      url: "/api/bot/getMatching",
      method: "POST",
      body: JSON.stringify({ bot_id }),
      response: (results) =>
        results.json().then(({ data }) => {
          // console.log(data);
          if (data?.length > 0) {
            const { bot_name } = data.map((v) => ({ bot_name: v.bot_name }))[0];
            //console.log("bot_name", bot_name);
            const { bd_id } = data.map((v) => ({ bd_id: v.bd_id }))[0];
            //console.log("bd_id: ", bd_id);
            if (bd_id) {
              Promise.all(
                data.map((v) => ({
                  id: v.dialog_id,
                  name: v.dialog_name,
                  bgcolor: "hsla(82,70%,70%,0.8)",
                }))
              ).then((newData) =>
                this.setState({
                  todo: [...this.state.todo, ...newData],
                  bot_name,
                })
              );
            }
          }
        }),
    });
  }

  genBotToken() {
    // const {org_code} = JSON.parse(localStorage.getItem('login'));
    const name_query = new URLSearchParams(window.location.search);
    const bot_code = name_query.get("bot_code");

    // const org_code = "ai9";
    const { org_code } = JSON.parse(localStorage.getItem("login"));

    checkSession({
      url: "/api/auth/genBotJWT",
      method: "POST",
      body: JSON.stringify({ org_code, bot_code }),
      response: (response) => {
        response.json().then(({ botToken }) => {
          this.setState({ botToken });
          // console.log("bot: ", botToken);
        });
      },
    });
  }

  componentDidMount() {
    this.getTopicList();
    this.getDialogList();
    this.getMatching();
    this.genBotToken();
  }

  onDragOverDiv = (ev) => {
    ev.preventDefault();
  };
  onDragOver = (ev, cat) => {
    ev.preventDefault();
    let newList = this.state.originalOrder;
    const draggedFrom = this.state.draggedFrom;
    const draggedTo = Number(ev.currentTarget.dataset.position);
    const itemDragged = newList[draggedFrom];
    const remainingItems = newList.filter(
      (item, index) => index !== draggedFrom
    );
    newList = [
      ...remainingItems.slice(0, draggedTo),
      itemDragged,
      ...remainingItems.slice(draggedTo),
    ];
    if (draggedTo !== this.state.draggedTo) {
      this.setState({ updatedOrder: newList, draggedTo });
    }
  };

  onDragLeave = () => {
    this.setState({ draggedTo: null });
  };

  onDropDiv = (ev, cat) => {
    let old_cat = ev.dataTransfer.getData("cat");
    if (old_cat != cat) {
      let bgcolor =
        cat === "todo" ? "hsla(82,70%,70%,0.8)" : "hsla(204.8,53%,50.8%,0.7)";
      let newItem = [
        ...this.state[cat],
        { ...this.state[old_cat][this.state.draggedFrom], bgcolor },
      ];
      this.state[old_cat].splice(this.state.draggedFrom, 1);

      this.setState({
        [cat]: newItem,
        [old_cat]: this.state[old_cat],
      });
    }
  };
  onDrop = (ev, cat) => {
    let old_cat = ev.dataTransfer.getData("cat");
    if (old_cat == cat) {
      // //console.log(this.state.tasks,this.state.updatedOrder)
      this.setState({
        draggedFrom: null,
        draggedTo: null,
        isDragging: false,
        [cat]: this.state.updatedOrder,
      });
    }
  };

  onDragStart = (ev, id, cat) => {
    const initialPosition = Number(ev.currentTarget.dataset.position);
    ev.dataTransfer.setData("id", id);
    ev.dataTransfer.setData("cat", cat);
    this.setState({
      draggedFrom: initialPosition,
      isDragging: true,
      originalOrder: this.state[cat],
    });
    //event.dataTransfer.setData("text/html","")
  };

  handleAdd = (ev, id) => {
    //console.log("dragstart:", id);
  };

  onSave = () => {
    const dialogs = this.state.todo.map((v) => v.id);

    const { org_id } = JSON.parse(localStorage.getItem("login"));

    const query = new URLSearchParams(window.location.search);
    const bot_id = query.get("bot_id");

    checkSession({
      url: "/api/bot/updateMatch",
      method: "PUT",
      body: JSON.stringify({ bot_id, dialogs }),
      response: (results) =>
        results.json().then(({ data }) => {
          fetch(`${apiUrl}/api/dialog/content/getMatching`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": (
                JSON.parse(localStorage.getItem("login")) || { accessToken: "" }
              ).accessToken,
            },
            body: JSON.stringify({ dialogs }),
          })
            .then((results) => results.json())
            .then(({ intent, tag, parameter, table }) => {
              fetch(`${apiUrl}/api/bot/content/add`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-access-token": (
                    JSON.parse(localStorage.getItem("login")) || {
                      accessToken: "",
                    }
                  ).accessToken,
                },
                redirect: "follow",
                body: JSON.stringify({
                  bot_id,
                  content: intent,
                  tag,
                  parameter,
                  table,
                  org_id,
                }),
              }).then((response) => {
                response.json().then((result) => {
                  //console.log("result", result);
                });
              });
            })
            .catch((e) => console.log("error", e));
          swal("Saved successfully", "", "success");
        }),
    });
  };

  getMatchingContent = () => {
    const dialogs = this.state.todo.map((v) => v.id);

    const name_query = new URLSearchParams(window.location.search);
    const bot_code = name_query.get("bot_code");
    const { org_code } = JSON.parse(localStorage.getItem("login"));

    // //console.log(bot_code);
    checkSession({
      url: "/api/dialog/content/getMatching",
      method: "POST",
      body: JSON.stringify({ dialogs }),
      response: (results) =>
        results.json().then(({ intent, tag, parameter, table }) => {
          this.setState((prevState) => ({
            modal: !prevState.modal,
            json_content: JSON.stringify({
              bot: bot_code,
              intent,
              tag,
              parameter,
              table,
            }),
          }));
          // console.log("json_content: ", this.state.json_content);
          fetch(`${editorUrl}/${org_code}/engine/api/v1.1/bot/deploy`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": this.state.botToken,
            },
            redirect: "follow",
            body: this.state.json_content,
          }).then((response) => {
            response.json().then((result) => {
              console.log("result", result);
              // window.open(
              //   `https://cuicui.ai9.co.th/widget/?org=${org_code}&tk=${this.state.botToken}`,
              //   "_blank"
              // );
            });
          });
        }),
    });
  };

  downloadJsonFile = () => {
    const element = document.createElement("a");
    const file = new Blob([document.getElementById("content").value], {
      type: "application/json;charset=utf-8",
    });
    element.href = URL.createObjectURL(file);
    element.download = "bot_dialog.json";
    document.body.appendChild(element);
    element.click();
  };

  render() {
    const name_query = new URLSearchParams(window.location.search);
    const bot_name = name_query.get("bot_name");

    const { search, topic } = this.state;
    const lowercasedFilter = search.toString().toLowerCase();
    const filteredData = topic.filter((item) => {
      return item["topic_name"].toLowerCase().includes(lowercasedFilter);
    });

    const { searchDialog, dialog } = this.state;
    const lowercasedDialogFilter = searchDialog.toString().toLowerCase();
    const filteredDialogData = dialog.filter((item) => {
      return item["dialog_name"].toLowerCase().includes(lowercasedDialogFilter);
    });

    const getCustomLauncher = (handleToggle) => null;
    return (
      <Page title={"Bot Setting: " + bot_name}>
        <div className="container-drag">
          <Row>
            <Col sm="3">
              <Card style={{ maxHeight: 575 }}>
                <CardHeader>Filter by:</CardHeader>
                <CardBody style={{ overflowX: "scroll" }}>
                  <FormGroup>
                    <Input
                      type="text"
                      name="keyword"
                      id="keyword"
                      placeholder="Search topic..."
                      onChange={(e) =>
                        this.setState({ search: e.target.value.split(" ") })
                      }
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="exampleCheckbox">
                      <b>Topic</b>
                    </Label>
                    <div>
                      {filteredData.map((v) => (
                        <CustomInput
                          type="checkbox"
                          id={`${v.topic_id}`}
                          label={`${v.topic_name}`}
                          key={v.topic_name}
                          onChange={(e) => {
                            if (e.target.checked) {
                              this.setState({
                                checked: [...this.state.checked, v.topic_id],
                              });
                            } else {
                              this.setState({
                                checked: this.state.checked.filter(
                                  (a) => a != v.topic_id
                                ),
                              });
                            }
                          }}
                        />
                      ))}
                    </div>
                  </FormGroup>
                </CardBody>
              </Card>
            </Col>
            <Col sm="4">
              <div
                onDrop={(e) => this.onDropDiv(e, "done")}
                onDragOver={(ev) => this.onDragOverDiv(ev)}
              >
                <Card style={{ maxHeight: 575 }}>
                  <CardHeader>Dialog</CardHeader>
                  <CardBody style={{ overflowX: "scroll" }}>
                    {/* <FormGroup>
                      <Input
                        type="text"
                        name="dialog_eyword"
                        id="dialog_keyword"
                        placeholder="Search dialog..."
                        onChange={(e) =>
                          this.setState({
                            searchDialog: e.target.value.split(" "),
                          })
                        }
                      />
                    </FormGroup> */}
                    {this.state.done.map((t, index) =>
                      this.state.checked.length &&
                      "topic_id" in t &&
                      !this.state.checked.includes(t["topic_id"]) ? null : (
                        <div
                          key={t.id}
                          data-position={index}
                          onDragStart={(e) => this.onDragStart(e, t.id, "done")}
                          onDrop={(e) => this.onDrop(e, "done")}
                          onDragOver={(ev) => this.onDragOver(ev, "done")}
                          draggable
                          className="draggable"
                          style={{
                            backgroundColor: t.bgcolor,
                            marginBottom: 10,
                            padding: 7,
                            paddingLeft: 15,
                            borderRadius: 5,
                          }}
                        >
                          <td>{t.name}</td>
                        </div>
                      )
                    )}
                  </CardBody>
                </Card>
              </div>
            </Col>
            <Col sm="4">
              {/* <div onDragOver สั่งให้ลากมาแสดงผลได้ */}
              <div
                onDrop={(e) => this.onDropDiv(e, "todo")}
                onDragOver={(ev) => this.onDragOverDiv(ev)}
              >
                <Card style={{ maxHeight: 575 }}>
                  <CardHeader>Bot</CardHeader>
                  <CardBody style={{ overflowX: "scroll" }}>
                    {this.state.todo.map((t, index) =>
                      this.state.checked.length &&
                      "topic_id" in t &&
                      !this.state.checked.includes(t["topic_id"]) ? null : (
                        <div
                          key={t.id}
                          data-position={index}
                          onDragStart={(e) => this.onDragStart(e, t.id, "todo")}
                          onDragOver={(e) => this.onDragOver(e, "todo")}
                          onDrop={(e) => {
                            this.onDrop(e, "todo");
                          }}
                          draggable
                          className="draggable"
                          style={{
                            backgroundColor: t.bgcolor,
                            marginBottom: 10,
                            padding: 7,
                            paddingLeft: 15,
                            borderRadius: 5,
                          }}
                        >
                          <td>{t.name}</td>
                        </div>
                      )
                    )}
                  </CardBody>
                  <CardFooter>
                    {/* <LinkAssistant
                      height={700}
                      // dialog_name={bot_name}
                      href={
                        "https://cuicui.ai9.co.th/assistant/test/demo.html?token=" +
                        this.state.botToken
                      }
                    >
                      <Button color="btn2" onClick={this.chatToggle}>
                        Assistant
                      </Button>
                    </LinkAssistant>{" "} */}
                    <Button color="success" onClick={this.toggle}>
                      Launch
                    </Button>
                    <Button
                      color="primary"
                      style={{ float: "right" }}
                      onClick={this.onSave}
                    >
                      Save
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              <div>
                <Widget
                  title={bot_name}
                  subtitle={false}
                  // onClick={this.chatToggle}
                  handleToggle={this.chatToggle}
                  // handleQuickButtonClicked={()=>this.chatToggle}
                  // launcher={() => this.chatToggle}
                  // launcher={(handleToggle) => getCustomLauncher(handleToggle)}
                  handleNewUserMessage={this.handleNewUserMessage}
                />
              </div>
              <div>
                <LinkAssistant
                  height={670}
                  href={
                    "https://cuicui.ai9.co.th/assistant/test/demo.html?token=" +
                    this.state.botTokenTest
                  }
                >
                  <Button
                    color="success"
                    className="assistantButton"
                    onClick={this.assistantToggle}
                  >
                    <img src={mascot} />
                  </Button>
                </LinkAssistant>
              </div>
            </Col>
          </Row>
        </div>
      </Page>
    );
  }
}
