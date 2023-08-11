deploy:
	. ~/.nvm/nvm.sh && nvm use
	pnpm run build
	cd deploy && ansible-playbook -i hosts deploy.yml

.PHONY: deploy
