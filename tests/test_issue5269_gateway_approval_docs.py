from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ADVANCED = (ROOT / "docs" / "advanced-chat-setup.md").read_text(encoding="utf-8")
DOCKER = (ROOT / "docs" / "docker.md").read_text(encoding="utf-8")


def test_advanced_chat_docs_name_gateway_approval_runs_api_opt_in():
    assert "HERMES_WEBUI_CHAT_BACKEND=gateway" in ADVANCED
    assert "HERMES_WEBUI_GATEWAY_USE_RUNS_API=true" in ADVANCED
    assert "approval prompts" in ADVANCED
    assert "approval card" in ADVANCED
    assert "legacy chat-completions transport" in ADVANCED


def test_docker_docs_name_webui_service_runs_api_opt_in_for_approval_cards():
    assert "HERMES_WEBUI_CHAT_BACKEND=gateway" in DOCKER
    assert "HERMES_WEBUI_GATEWAY_BASE_URL=http://hermes-agent:8642" in DOCKER
    assert "HERMES_WEBUI_GATEWAY_USE_RUNS_API=true" in DOCKER
    assert "approval cards" in DOCKER
    assert "WebUI service" in DOCKER
