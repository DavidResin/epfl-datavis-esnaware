# Script to generate test nodes and links

import itertools, json
from random import sample
from string import ascii_uppercase

n, l = 30, 50

def iter_all_strings():
	for size in itertools.count(1):
		for s in itertools.product(ascii_uppercase, repeat=size):
			yield "".join(s)

names = [s for s in itertools.islice(iter_all_strings(), n)]
links = sample([{"source" : a, "target" : b} for a in names for b in names if a < b], l)

d, e = dict(), dict()

for x in links:
	d[x["source"]] = d[x["source"]] + [x["target"]] if d.get(x["source"]) else [x["target"]]

for a, b in d.items():
	for bi in b:
		e[a] = e[a] + [bi] if e.get(a) else [bi]
		e[bi] = e[bi] + [a] if e.get(bi) else [a]

nodes = [{"id" : n, "neighbors" : e[n]} for n in names]

with open("data.json", "w") as f:
	json.dump({"nodes" : nodes, "links" : links}, f, indent="\t")
